export interface BadgeInfo {
  name: string;
  icon: string;
  description: string;
}

const BADGE_DEFINITIONS: Record<string, BadgeInfo> = {
  "first-story": {
    name: "Tác giả đầu tiên",
    icon: "✍️",
    description: "Có 1 câu chuyện được duyệt",
  },
  "storyteller-5": {
    name: "Người kể chuyện",
    icon: "📚",
    description: "Có 5 câu chuyện được duyệt",
  },
  "explorer-10": {
    name: "Nhà thám hiểm",
    icon: "🧭",
    description: "Yêu thích 10 địa danh",
  },
  planner: {
    name: "Nhà lên kế hoạch",
    icon: "📋",
    description: "Tạo 1 lộ trình",
  },
  "voyager-3": {
    name: "Lữ khách",
    icon: "🗺️",
    description: "Có 3 lộ trình công khai",
  },
};

export function getBadgeInfo(badgeId: string): BadgeInfo {
  return BADGE_DEFINITIONS[badgeId] || { name: badgeId, icon: "🏅", description: "" };
}

export function getAllBadgeIds(): string[] {
  return Object.keys(BADGE_DEFINITIONS);
}
