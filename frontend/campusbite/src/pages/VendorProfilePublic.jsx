import { useContext, useEffect, useState } from "react";
import {
  FaClock,
  FaEnvelope,
  FaGlobe,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhone,
  FaStore,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import API from "../services/api";
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

function VendorProfilePublic() {
  const { id: vendorId } = useParams();
  const { showToast } = useContext(ToastContext);
  const [profile, setProfile] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`/auth/vendor/${vendorId}`);
        setProfile({ ...emptyProfile, ...res.data });
      } catch (error) {
        console.log(error);
        if (showToast) {
          showToast({
            message: "Failed to load seller profile",
            type: "error",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [vendorId, showToast]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-stone-300 bg-[#fbfaf7] p-8 text-center text-stone-700 shadow-sm">
        Loading seller profile...
      </div>
    );
  }

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
      {/* Header Section */}
      <section className="overflow-hidden rounded-3xl border border-stone-300 bg-[#fbfaf7] shadow-sm">
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
          <div className="min-w-0">
            <div className="mb-4">
              <BackButton fallback="/vendors" />
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
              {profile.bio || ""}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <ProfileStat label="Profile Complete" value={`${completion}%`} />
            <ProfileStat label="Category" value={profile.businessCategory || "Not set"} />
            <ProfileStat label="Service Area" value={profile.campus || "Not set"} />
          </div>
        </div>
      </section>

      {/* Business Details Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Contact Information */}
        <section className="rounded-3xl border border-stone-300 bg-[#fbfaf7] p-4 shadow-sm transition hover:border-amber-200 hover:shadow-md sm:p-6">
          <h2 className="mb-4 text-xl font-bold text-stone-950">Contact & Location</h2>
          <div className="space-y-4">
            <InfoRow icon={<FaEnvelope />} label="Email" value={profile.email} />
            <InfoRow icon={<FaPhone />} label="Phone" value={profile.phone} />
            <InfoRow icon={<FaMapMarkerAlt />} label="Address" value={profile.address} />
            <InfoRow icon={<FaClock />} label="Hours" value={profile.businessHours} />
          </div>
        </section>

        {/* Delivery & Social */}
        <section className="rounded-3xl border border-stone-300 bg-[#fbfaf7] p-4 shadow-sm transition hover:border-amber-200 hover:shadow-md sm:p-6">
          <h2 className="mb-4 text-xl font-bold text-stone-950">Social & Delivery</h2>
          <div className="space-y-4">
            {profile.deliveryInfo && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                  Delivery Info
                </p>
                <p className="mt-2 text-sm text-stone-700">{profile.deliveryInfo}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              {profile.socialMedia?.instagram && (
                <SocialLink icon={<FaInstagram />} label="Instagram" value={profile.socialMedia.instagram} />
              )}
              {profile.socialMedia?.twitter && (
                <SocialLink icon={<FaPhone />} label="Twitter" value={profile.socialMedia.twitter} />
              )}
              {profile.socialMedia?.facebook && (
                <SocialLink icon={<FaPhone />} label="Facebook" value={profile.socialMedia.facebook} />
              )}
              {profile.socialMedia?.website && (
                <SocialLink icon={<FaGlobe />} label="Website" value={profile.socialMedia.website} />
              )}
            </div>
          </div>
        </section>
      </div>
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

function InfoRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-amber-600">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">{label}</p>
        <p className="mt-1 text-sm text-stone-700 wrap-break-word">{value}</p>
      </div>
    </div>
  );
}

function SocialLink({ icon, label, value }) {
  return (
    <a
      href={normaliseSocialUrl(value)}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm transition hover:border-amber-300 hover:bg-amber-50"
    >
      <span className="text-amber-600">{icon}</span>
      <span className="font-semibold text-stone-700">{label}</span>
    </a>
  );
}

function normaliseSocialUrl(value) {
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

export default VendorProfilePublic;
