"use client"

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
      "https://api.github.com/repos/tribu-ia/ags-investigacion-front/contributors?per_page=4",
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
    <div className="space-y-4 pt-10">
      <h2 className="text-xl font-bold text-center text-foreground font-mono">
        Contribuidores
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading ? (
          <>
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="flex items-center gap-2">
                <Skeleton className="size-8 rounded-full bg-foreground/15" />
                <Skeleton className="w-24 h-4 bg-foreground/15 rounded" />
              </div>
            ))}
          </>
        ) : (
          <>
            {contributors?.map((contributor) => (
              <Link
                key={contributor.id}
                className="flex items-center flex-col md:flex-row gap-2 text-center hover:underline hover:decoration-wavy hover:decoration-primary  "
                href={contributor.html_url}
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                <Image
                  src={contributor.avatar_url}
                  alt={contributor.login}
                  className="w-8 h-8 rounded-full"
                  width={32}
                  height={32}
                  unoptimized
                />
                <span className="text-sm font-semibold text-foreground">
                  {contributor.login}
                </span>
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
