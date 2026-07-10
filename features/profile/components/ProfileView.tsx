"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { LogIn, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Loading } from "@/components/ui/Loading";
import { profileConfig } from "@/features/profile/config";
import { useTranslation } from "@/components/providers/LocaleProvider";
import { useModuleLabels } from "@/hooks/useModuleLabels";

export function ProfileView() {
  const { user, loading, isConfigured, signInWithGoogle, signOut } = useAuth();
  const { t } = useTranslation();
  const { name: profileName } = useModuleLabels(profileConfig);
  const searchParams = useSearchParams();
  const [signingIn, setSigningIn] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("error") === "auth") {
      setError(t("profile.authError"));
    }
  }, [searchParams, t]);

  const Icon = profileConfig.icon;

  const handleSignIn = async () => {
    setError(null);
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : t("profile.signInError")
      );
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    setError(null);
    setSigningOut(true);
    try {
      await signOut();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("profile.signOutError"));
    } finally {
      setSigningOut(false);
    }
  };

  if (loading) {
    return <Loading label={t("profile.loading")} className="py-16" />;
  }

  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-sm">
          {user?.user_metadata?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.user_metadata.avatar_url}
              alt=""
              className="h-20 w-20 rounded-2xl object-cover"
            />
          ) : (
            <Icon size={40} strokeWidth={1.5} />
          )}
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          {user ? displayName(user, t("profile.defaultUser")) : profileName}
        </h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          {user ? user.email : t("profile.guestHint")}
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-xl p-3">
          {error}
        </p>
      )}

      {!isConfigured ? (
        <div className="rounded-xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
          {t("profile.supabaseNotConfigured")}
        </div>
      ) : user ? (
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-card p-4 text-sm">
            <p className="font-medium">{t("profile.activeSession")}</p>
            <p className="mt-1 text-muted-foreground">
              {t("profile.activeSessionHint")}
            </p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-50"
          >
            <LogOut size={18} />
            {signingOut ? t("profile.signingOut") : t("profile.signOut")}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleSignIn}
            disabled={signingIn}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <LogIn size={18} />
            {signingIn ? t("profile.redirecting") : t("profile.continueGoogle")}
          </button>
          <p className="text-center text-xs text-muted-foreground">
            {t("profile.signInHint")}
          </p>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-start gap-3">
          <UserIcon size={20} className="mt-0.5 shrink-0 text-muted-foreground" />
          <div className="text-sm">
            <p className="font-medium">{t("profile.hymnario")}</p>
            <p className="mt-1 text-muted-foreground">
              {user ? t("profile.synced") : t("profile.guestHymns")}
            </p>
            <Link
              href="/hymns"
              className="mt-2 inline-block text-primary hover:underline"
            >
              {t("profile.goToHymns")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function displayName(
  user: {
    user_metadata?: { full_name?: string; name?: string };
    email?: string;
  },
  fallback: string
): string {
  return (
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email ??
    fallback
  );
}
