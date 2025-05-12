import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface Props {
  paths: {
    name: string;
    href?: string;
    translationKey?: string;
  }[];
}

export default function Breadcrumbs({ paths }: Props) {
  const { t } = useTranslation();

  return (
    <nav className="text-sm text-gray-500 mb-4">
      <ol className="flex flex-wrap gap-1 items-center">
        {paths.map((p, idx) => (
          <li key={idx} className="flex items-center gap-1">
            {p.href ? (
              <Link to={p.href} className="hover:underline text-teal-600">
                {p.translationKey ? t(p.translationKey) : p.name}
              </Link>
            ) : (
              <span className="text-gray-700 font-medium truncate max-w-xs">
                {p.translationKey ? t(p.translationKey) : p.name}
              </span>
            )}
            {idx < paths.length - 1 && <span>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
