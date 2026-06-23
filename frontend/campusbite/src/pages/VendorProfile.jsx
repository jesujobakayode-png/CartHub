import { useContext, useEffect, useState } from "react";
import {
  FaSave,
  FaStore,
} from "react-icons/fa";

import BackButton from "../components/BackButton";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { ToastContext } from "../context/ToastContext";

const emptyProfile = {
  name: "",
  brandName: "",
  email: "",
  phone: "",
  address: "",
  campus: "",
  businessCategory: "",
  bio: "",
  businessHours: "",
  deliveryInfo: "",
  logo: "",
  socialMedia: {
    instagram: "",
    twitter: "",
    facebook: "",
    website: "",
  },
};

function VendorProfile() {
  const { user, updateUser } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const [profile, setProfile] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/me");
        setProfile({ ...emptyProfile, ...res.data });
      } catch (error) {
        console.log(error);
        setProfile({ ...emptyProfile, ...user });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("socialMedia.")) {
      const key = name.split(".")[1];
      setProfile((prev) => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [key]: value,
        },
      }));
      return;
    }

    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await API.put("/auth/profile", profile);
      setProfile({ ...emptyProfile, ...res.data });
      updateUser(res.data);

      if (showToast) {
        showToast({ message: "Seller profile updated", type: "success" });
      }
    } catch (error) {
      console.log(error);

      if (showToast) {
        showToast({
          message: error.response?.data?.message || "Profile update failed",
          type: "error",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-stone-300 bg-[#fbfaf7] p-8 text-center text-stone-700 shadow-sm">
        Loading seller profile...
      </div>
    );
  }

  const uploadLogo = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setSaving(true);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "campusbite");

      const res = await fetch("https://api.cloudinary.com/v1_1/dcptr9k9n/image/upload", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      setProfile((prev) => ({ ...prev, logo: result.secure_url }));
    } catch (error) {
      console.log("Logo upload error:", error);
      if (showToast) showToast({ message: "Logo upload failed", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const displayName = profile.brandName || profile.name || "Seller Profile";
  const completionItems = [
    profile.name,
    profile.brandName,
    profile.email,
    profile.phone,
    profile.address,
    profile.businessCategory,
    profile.businessHours,
    profile.deliveryInfo,
  ];
  const completedCount = completionItems.filter(Boolean).length;
  const completion = Math.round((completedCount / completionItems.length) * 100);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-stone-300 bg-[#fbfaf7] shadow-sm">
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
          <div className="min-w-0">
            <div className="mb-4">
              <BackButton fallback="/vendor-dashboard" />
            </div>
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-3xl text-amber-700 shadow-sm">
              {profile.logo ? (
                <img
                  src={profile.logo}
                  alt={displayName}
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : (
                <FaStore />
              )}
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600">
              Seller Profile
            </p>
            <h1 className="mt-2 text-3xl font-bold text-stone-950 sm:text-4xl">
              {displayName}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
              {profile.bio ||
                "Add a clear business bio so shoppers know what you sell, when you are available, and how to reach you."}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <ProfileStat label="Profile Complete" value={`${completion}%`} />
            <ProfileStat label="Category" value={profile.businessCategory || "Not set"} />
            <ProfileStat label="Campus" value={profile.campus || "Not set"} />
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <ProfileSection title="Business Identity">
            <FormField
              label="Owner Name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Your full name"
            />
            <FormField
              label="Brand Name"
              name="brandName"
              value={profile.brandName}
              onChange={handleChange}
              placeholder="Business or store name"
            />
            <FormField
              label="Business Category"
              name="businessCategory"
              value={profile.businessCategory}
              onChange={handleChange}
              placeholder="Meals, snacks, drinks, groceries..."
            />
            <label className="block text-sm font-semibold text-stone-700">
              Upload Logo
              <input
                type="file"
                accept="image/*"
                onChange={uploadLogo}
                className="mt-2 min-h-12 w-full rounded-lg border border-stone-200 bg-stone-50 p-3 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-amber-500 file:px-3 file:py-2 file:font-semibold file:text-black"
              />

              {profile.logo && (
                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={profile.logo}
                    alt="logo preview"
                    className="h-14 w-14 rounded-lg border border-stone-200 object-cover"
                  />
                  <div className="text-sm text-stone-600">Current logo preview</div>
                </div>
              )}
            </label>
            <TextAreaField
              label="Business Bio"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              placeholder="Tell shoppers what your brand is known for."
            />
          </ProfileSection>

          <ProfileSection title="Contact And Location">
            <FormField
              label="Email"
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              placeholder="seller@example.com"
            />
            <FormField
              label="Phone Number"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="+234..."
            />
            <FormField
              label="Campus"
              name="campus"
              value={profile.campus}
              onChange={handleChange}
              placeholder="University or campus area"
            />
            <TextAreaField
              label="Address"
              name="address"
              value={profile.address}
              onChange={handleChange}
              placeholder="Pickup point, store location, hostel area, or delivery base"
            />
          </ProfileSection>

          <ProfileSection title="Marketplace Details">
            <FormField
              label="Business Hours"
              name="businessHours"
              value={profile.businessHours}
              onChange={handleChange}
              placeholder="Mon-Sat, 8:00 AM - 8:00 PM"
            />
            <TextAreaField
              label="Delivery And Pickup Info"
              name="deliveryInfo"
              value={profile.deliveryInfo}
              onChange={handleChange}
              placeholder="Delivery areas, pickup instructions, estimated prep time, or fees"
            />
          </ProfileSection>

          <ProfileSection title="Social Media">
            <FormField
              label="Instagram"
              name="socialMedia.instagram"
              value={profile.socialMedia?.instagram || ""}
              onChange={handleChange}
              placeholder="@brandname"
            />
            <FormField
              label="X / Twitter"
              name="socialMedia.twitter"
              value={profile.socialMedia?.twitter || ""}
              onChange={handleChange}
              placeholder="@brandname"
            />
            <FormField
              label="Facebook"
              name="socialMedia.facebook"
              value={profile.socialMedia?.facebook || ""}
              onChange={handleChange}
              placeholder="facebook.com/brandname"
            />
            <FormField
              label="Website"
              name="socialMedia.website"
              value={profile.socialMedia?.website || ""}
              onChange={handleChange}
              placeholder="https://brand.example"
            />
          </ProfileSection>
        </div>

        <aside className="h-fit space-y-4 rounded-3xl border border-stone-300 bg-[#fbfaf7] p-5 shadow-sm xl:sticky xl:top-28">
          <button
            type="submit"
            disabled={saving}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-amber-500 bg-amber-500 px-5 py-3 font-bold text-black shadow-sm transition hover:bg-amber-400 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FaSave />
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </aside>
      </form>
    </div>
  );
}

function ProfileStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-50 hover:shadow-md">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">{label}</p>
      <p className="mt-2 wrap-break-word text-xl font-bold text-stone-950">{value}</p>
    </div>
  );
}

function ProfileSection({ title, children }) {
  return (
    <section className="rounded-3xl border border-stone-300 bg-[#fbfaf7] p-4 shadow-sm transition hover:border-amber-200 hover:shadow-md sm:p-6">
      <h2 className="mb-4 text-xl font-bold text-stone-950">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function FormField({ label, type = "text", ...props }) {
  return (
    <label className="block text-sm font-semibold text-stone-700">
      {label}
      <input
        type={type}
        {...props}
        className="mt-2 min-h-12 w-full rounded-lg border border-stone-200 bg-stone-50 p-3 font-normal text-stone-950 outline-none transition hover:border-amber-300 hover:bg-white focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100"
      />
    </label>
  );
}

function TextAreaField({ label, ...props }) {
  return (
    <label className="block text-sm font-semibold text-stone-700 md:col-span-2">
      {label}
      <textarea
        {...props}
        className="mt-2 min-h-28 w-full rounded-lg border border-stone-200 bg-stone-50 p-3 font-normal text-stone-950 outline-none transition hover:border-amber-300 hover:bg-white focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100"
      />
    </label>
  );
}

export default VendorProfile;
