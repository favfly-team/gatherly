"use client";

import { useState } from "react";
import userStore from "@/storage/user-store";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const UserProfile = () => {
  const { user, isUpdating, updateUserProfile } = userStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    display_name: user?.display_name || "",
    email: user?.email || "",
    profile_image: user?.profile_image || "",
  });

  const handleSave = async () => {
    try {
      if (user?.id) {
        await updateUserProfile(user.id, formData);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCancel = () => {
    setFormData({
      display_name: user?.display_name || "",
      email: user?.email || "",
      profile_image: user?.profile_image || "",
    });
    setIsEditing(false);
  };

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <div className="flex items-center space-x-4 mb-6">
        <Avatar className="w-16 h-16">
          {user.profile_image ? (
            <img
              src={user.profile_image}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              {user.display_name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">
            {user.display_name || "User"}
          </h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor="display_name">Display Name</Label>
            <Input
              id="display_name"
              value={formData.display_name}
              onChange={(e) =>
                setFormData({ ...formData, display_name: e.target.value })
              }
              placeholder="Enter your display name"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Enter your email"
            />
          </div>

          <div>
            <Label htmlFor="profile_image">Profile Image URL</Label>
            <Input
              id="profile_image"
              value={formData.profile_image}
              onChange={(e) =>
                setFormData({ ...formData, profile_image: e.target.value })
              }
              placeholder="Enter image URL"
            />
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={handleSave}
              disabled={isUpdating}
              className="flex-1"
            >
              {isUpdating ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isUpdating}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button onClick={() => setIsEditing(true)} className="w-full">
          Edit Profile
        </Button>
      )}
    </div>
  );
};

export default UserProfile;
