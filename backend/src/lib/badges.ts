import { User } from "../models/User";
import { Story } from "../models/Story";
import { Itinerary } from "../models/Itinerary";

export interface BadgeDefinition {
  name: string;
  icon: string;
  description: string;
}

export const BADGE_DEFINITIONS: Record<string, BadgeDefinition> = {
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

export async function checkAndAwardBadges(userId: string): Promise<void> {
  const user = await User.findById(userId);
  if (!user) return;

  const newBadges = new Set(user.badges);

  // Count approved stories
  const approvedStories = await Story.countDocuments({
    userId,
    status: "approved",
  });
  if (approvedStories >= 1) newBadges.add("first-story");
  if (approvedStories >= 5) newBadges.add("storyteller-5");

  // Count favorites
  if (user.favorites.length >= 10) newBadges.add("explorer-10");

  // Count itineraries
  const totalItineraries = await Itinerary.countDocuments({ userId });
  if (totalItineraries >= 1) newBadges.add("planner");

  // Count public itineraries
  const publicItineraries = await Itinerary.countDocuments({
    userId,
    isPublic: true,
  });
  if (publicItineraries >= 3) newBadges.add("voyager-3");

  // Only update if new badges were added
  const badgeArray = Array.from(newBadges);
  if (badgeArray.length !== user.badges.length) {
    user.badges = badgeArray;
    await user.save();
  }
}
