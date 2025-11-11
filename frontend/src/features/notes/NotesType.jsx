import React from "react";
import { Link, useLocation } from "react-router-dom";
import LinkButton from "../../ui/LinkButton";

function NotesType() {
  const location = useLocation().pathname;
  const css = "sm:text-xl text-stone-700";
  const activeCss = "font-bold italic text-stone-200 underline";
  return (
    <div className="bg-emerald-200 uppercase row-span-2 md:col-span-2 md:h-dvh flex md:flex-col items-center md:items-start justify-between md:justify-normal gap-6 p-6 sm:p-4 sm:py-12 rounded-t-3xl md:rounded-r-4xl">
      <LinkButton
        type="link"
        to="/notes/quick/new"
        css={`
          ${location.includes("quick") && activeCss} ${css}
        `}
      >
        Quick Note
      </LinkButton>
      <LinkButton
        type="link"
        to="/notes/smart/new"
        css={`
          ${location.includes("smart") && activeCss} ${css}
        `}
      >
        Smart Note
      </LinkButton>
      <LinkButton
        type="link"
        to="/notes/geo/new"
        css={`
          ${location.includes("geo") && activeCss} ${css}
        `}
      >
        Geo Note
      </LinkButton>
    </div>
  );
}

export default NotesType;
