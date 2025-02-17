import { WhatsappIcon } from "@/components/ui/icons";
import { Instagram, LinkedinIcon } from "lucide-react";
import Link from "next/link";

export const FooterLanding = () => {
  return (
    <footer className="border-grid ">
      <div className="container-wrapper">
        <div className="container flex items-center py-3 flex-col justify-between sm:flex-row sm:py-0 sm:h-14 gap-3">
          <p className="text-sm text-center">
            Iniciativa de la comunidad de{" "}
            <Link
              href="https://tribuia.org/"
              className="font-bold text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              TribuIA
            </Link>
          </p>
          <ul className="flex items-center gap-4">
            <li>
              <Link
                href="https://www.instagram.com/tribuia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary"
              >
                <Instagram className="size-5" />
              </Link>
            </li>
            <li>
              <Link
                href="https://chat.whatsapp.com/JX7ctC1P16s2hfoYrcJ0a9"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary"
              >
                <WhatsappIcon className="size-5 min-w-5" />
              </Link>
            </li>
            <li>
              <Link
                href="https://www.linkedin.com/company/tribu-ia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary"
              >
                <LinkedinIcon className="size-5 min-w-5" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
