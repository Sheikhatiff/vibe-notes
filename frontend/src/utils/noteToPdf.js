import { jsPDF } from "jspdf";
import { formatDate } from "./formatDate";
import { showError, showSuccess } from "./toast";

/**
 * Generate a PDF document for a note
 * @param {Object} note - The note object containing all note data
 */
export const generateNotePDF = (note) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = margin;

  const addWrappedText = (text, x, y, maxWidth, lineHeight = 7) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + lines.length * lineHeight;
  };

  const checkNewPage = (requiredSpace) => {
    if (yPos + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
    }
  };

  // ===== Header =====
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 0, pageWidth, 35, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont(undefined, "bold");
  doc.text(note.title || "Untitled Note", margin, 20);

  // ===== Note Type Badge =====
  yPos = 45;
  doc.setFillColor(4, 120, 87);
  doc.roundedRect(margin, yPos, 50, 15, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.text(note.type.toUpperCase(), margin + 5, yPos + 10);
  yPos += 30;

  // ===== Metadata =====
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.setFont(undefined, "normal");

  const createdDate = formatDate(note.createdAt);
  doc.text(`Created: ${createdDate}`, margin, yPos);
  yPos += 6;

  if (note.updatedAt && note.updatedAt !== note.createdAt) {
    const updatedDate = formatDate(note.updatedAt);
    doc.text(`Last Updated: ${updatedDate}`, margin, yPos);
    yPos += 6;
  }

  if (note.favorite) {
    doc.setTextColor(241, 196, 15);
    doc.setFont(undefined, "bold");
    doc.text("• Favorite", margin, yPos);
    yPos += 10;
  }

  yPos += 6;

  // ===== Smart Note =====
  if (note.type === "smart" && note.prompt) {
    checkNewPage(30);
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text("AI Prompt:", margin, yPos);

    doc.setFont(undefined, "italic");
    doc.setTextColor(80, 80, 80);
    yPos += 6;
    yPos = addWrappedText(note.prompt, margin, yPos, contentWidth, 6);
    yPos += 10;
  }

  // ===== Geo Note =====
  if (note.type === "geo" && note.coordinates) {
    checkNewPage(40);
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text("Location Information", margin, yPos);
    yPos += 8;

    doc.setFont(undefined, "normal");
    doc.setTextColor(80, 80, 80);

    if (note.locationName) {
      doc.text(`Name: ${note.locationName}`, margin, yPos);
      yPos += 6;
    }

    doc.text(
      `Coordinates: ${note.coordinates.lat}, ${note.coordinates.lng}`,
      margin,
      yPos
    );
    yPos += 8;

    const mapsUrl = `https://www.google.com/maps?q=${note.coordinates.lat},${note.coordinates.lng}`;
    doc.setTextColor(41, 128, 185);
    doc.setFont(undefined, "italic");
    doc.textWithLink("View on Google Maps", margin, yPos, { url: mapsUrl });
    yPos += 12;
  }

  // ===== Tags =====
  if (note.tags && note.tags.length > 0) {
    checkNewPage(20);
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text("Tags:", margin, yPos);

    doc.setFont(undefined, "normal");
    let tagX = margin + 20;

    for (const tag of note.tags) {
      const tagText = `#${tag}`;
      const tagWidth = doc.getTextWidth(tagText);

      if (tagX + tagWidth > pageWidth - margin) {
        yPos += 6;
        tagX = margin + 20;
      }

      doc.text(tagText, tagX, yPos);
      tagX += tagWidth + 8;
    }
    yPos += 12;
  }

  // Divider
  checkNewPage(20);
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 15;

  // ===== Note Content =====
  checkNewPage(30);
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.text("Note Content", margin, yPos);
  yPos += 10;

  doc.setFont(undefined, "normal");
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(10);

  const paragraphs = note.note.split("\n");
  for (const paragraph of paragraphs) {
    if (paragraph.trim()) {
      checkNewPage(20);
      yPos = addWrappedText(paragraph, margin, yPos, contentWidth);
      yPos += 8;
    } else {
      yPos += 4;
    }
  }

  // ===== Footer =====
  const footerY = pageHeight - 15;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.setFont(undefined, "italic");
  doc.text(
    `Generated on ${new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`,
    margin,
    footerY
  );

  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, footerY);
  }

  const sanitizedTitle = (note.title || "note")
    .toLowerCase()
    .replaceAll(/[^a-z0-9]/g, "-")
    .replaceAll(/-+/g, "-")
    .substring(0, 50);

  const filename = `${sanitizedTitle}-${Date.now()}.pdf`;
  doc.save(filename);
};

// onClick handler
export const handleDownloadNotePDF = (note) => {
  try {
    if (!note) throw new Error("Note data is required");
    if (!note.title || !note.note || !note.type)
      throw new Error("Note is missing required fields");

    generateNotePDF(note);
    showSuccess("Note Saved in PDF successfully!");
  } catch (error) {
    showError(error || "Failed to generate PDF. Please try again.");
  }
};
