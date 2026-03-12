"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Container from "@/components/ui/Container";
import BadgeDisplay from "@/components/badges/BadgeDisplay";
import type { Story, Itinerary } from "@/types";
import { API_URL } from "@/lib/api-config";

interface PublicProfileData {
  user: {
    username: string;
    displayName?: string;
    bio?: string;
    avatar?: string;
    badges: string[];
    createdAt: string;
  };
  stats: {
    storyCount: number;
    itineraryCount: number;
    favoriteCount: number;
  };
  stories: Story[];
  itineraries: Itinerary[];
}

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [profile, setProfile] = useState<PublicProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/users/${username}/public`)
      .then((res) => {
        if (!res.ok) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((json) => {
        if (json?.success) setProfile(json.data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <section className="py-12 sm:py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center py-16 text-gray-400">
            Đang tải...
          </div>
        </Container>
      </section>
    );
  }

  if (notFound || !profile) {
    return (
      <section className="py-12 sm:py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy</h1>
            <p className="text-gray-500">Profile này không tồn tại hoặc chưa được công khai.</p>
          </div>
        </Container>
      </section>
    );
  }

  const { user, stats, stories, itineraries } = profile;

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-start gap-5 mb-8">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.displayName || user.username}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                {(user.displayName || user.username)[0].toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                {user.displayName || user.username}
              </h1>
              <p className="text-sm text-gray-400 mb-2">
                @{user.username} · Tham gia{" "}
                {new Date(user.createdAt).toLocaleDateString("vi-VN", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
              {user.bio && (
                <p className="text-gray-600 text-sm">{user.bio}</p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 rounded-xl bg-blue-50">
              <div className="text-2xl font-bold text-blue-600">{stats.storyCount}</div>
              <div className="text-xs text-blue-500 mt-1">Câu chuyện</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-green-50">
              <div className="text-2xl font-bold text-green-600">{stats.itineraryCount}</div>
              <div className="text-xs text-green-500 mt-1">Lộ trình</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-pink-50">
              <div className="text-2xl font-bold text-pink-600">{stats.favoriteCount}</div>
              <div className="text-xs text-pink-500 mt-1">Yêu thích</div>
            </div>
          </div>

          {/* Badges */}
          {user.badges.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Huy hiệu</h2>
              <BadgeDisplay badges={user.badges} />
            </div>
          )}

          {/* Stories */}
          {stories.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Câu chuyện</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stories.map((story) => (
                  <Link
                    key={story.id}
                    href={`/cau-chuyen/${story.slug}`}
                    className="block p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-sm transition-all"
                  >
                    {story.photos?.[0]?.src && (
                      <img
                        src={story.photos[0].src}
                        alt={story.title}
                        className="w-full h-36 object-cover rounded-lg mb-3"
                      />
                    )}
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                      {story.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(story.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Itineraries */}
          {itineraries.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Lộ trình</h2>
              <div className="space-y-3">
                {itineraries.map((it) => (
                  <Link
                    key={it.id}
                    href={`/lo-trinh/${it.slug}`}
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-sm transition-all"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {it.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {it.days.length} ngày ·{" "}
                        {new Date(it.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
