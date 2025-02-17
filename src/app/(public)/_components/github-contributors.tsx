"use client";

import { Marquee } from "@/components/ui/marquee";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// TODO: move to types
interface GitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  user_view_type: string;
  site_admin: boolean;
  contributions: number;
}

export const GitHubContributors = () => {
  const [loading, setLoading] = useState(true);
  const [contributors, setContributors] = useState<GitHubUser[]>([]);

  useEffect(() => {
    fetch(
      "https://api.github.com/repos/tribu-ia/ags-investigacion-front/contributors?per_page=10",
      {
        method: "GET",
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => setContributors(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-3 pt-5">
      <h2 className="text-base font-bold text-center text-foreground font-mono">
        Contribuidores
      </h2>
      <div className="w-full">
        <Marquee
          pauseOnHover={!loading}
          className="[--duration:20s] [--gap:3rem]"
        >
          {loading ? (
            <>
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="flex items-center gap-2">
                  <Skeleton className="size-8 rounded-full bg-foreground/15" />
                  <div>
                    <Skeleton className="w-24 h-4 bg-foreground/15 rounded mb-1" />
                    <Skeleton className="w-16 h-3 bg-foreground/15 rounded" />
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              {contributors?.map((contributor, index) => (
                <Link
                  key={contributor.id + index}
                  className="flex items-center gap-4 group/link"
                  href={contributor.html_url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  <Image
                    src={contributor.avatar_url}
                    alt={contributor.login}
                    className="size-8 rounded-full"
                    width={32}
                    height={32}
                    unoptimized
                  />
                  <div className="text-left">
                    <h4 className="text-sm font-semibold text-primary group-hover/link:underline group-hover/link:decoration-wavy group-hover/link:decoration-primary">
                      {contributor.login}
                    </h4>
                    <p className="text-xs text-foreground">
                      {contributor.contributions} contribuciones
                    </p>
                  </div>
                </Link>
              ))}
            </>
          )}
        </Marquee>
      </div>
    </div>
  );
};
