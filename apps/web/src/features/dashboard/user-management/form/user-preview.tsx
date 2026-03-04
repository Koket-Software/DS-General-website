import { AppImage } from "@/components/common/AppImage";

interface UserPreviewProps {
  name: string;
  email: string;
  role: "admin" | "blogger" | "user";
  emailVerified: boolean;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  avatarPreview?: string | null;
  headshotPreview?: string | null;
}

export function UserPreview({
  name,
  email,
  role,
  emailVerified,
  firstName,
  lastName,
  phoneNumber,
  avatarPreview,
  headshotPreview,
}: UserPreviewProps) {
  const roleStyles = {
    admin:
      "bg-destructive/15 text-destructive dark:bg-destructive/25 dark:text-destructive-foreground",
    blogger: "bg-info/15 text-info dark:bg-info/25 dark:text-info-foreground",
    user: "bg-muted text-foreground/90 dark:bg-secondary dark:text-secondary-foreground",
  };

  const roleLabels = {
    admin: "Admin",
    blogger: "Blogger",
    user: "User",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Preview</h2>
        <div className="border rounded-lg p-6 space-y-4 bg-background dark:bg-card">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            {avatarPreview ? (
              <AppImage
                src={avatarPreview}
                alt={name || "User avatar"}
                className="h-16 w-16 rounded-full object-cover border-2 border-border"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-medium text-primary border-2 border-border">
                {name ? name.charAt(0).toUpperCase() : "?"}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg">
                {name || "Unnamed User"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {email || "No email"}
              </p>
            </div>
          </div>

          {/* Role */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Role
            </p>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${roleStyles[role]}`}
            >
              {roleLabels[role]}
            </span>
          </div>

          {/* Email Verified */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Email Status
            </p>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                emailVerified
                  ? "bg-success/15 text-success dark:bg-success/25 dark:text-success-foreground"
                  : "bg-warning/15 text-warning dark:bg-warning/25 dark:text-warning-foreground"
              }`}
            >
              {emailVerified ? "Verified" : "Unverified"}
            </span>
          </div>

          {/* Profile Information */}
          {(firstName || lastName || phoneNumber || headshotPreview) && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Profile Information</h4>
              <div className="space-y-2">
                {firstName && (
                  <div>
                    <p className="text-xs text-muted-foreground">First Name</p>
                    <p className="text-sm">{firstName}</p>
                  </div>
                )}
                {lastName && (
                  <div>
                    <p className="text-xs text-muted-foreground">Last Name</p>
                    <p className="text-sm">{lastName}</p>
                  </div>
                )}
                {phoneNumber && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Phone Number
                    </p>
                    <p className="text-sm">{phoneNumber}</p>
                  </div>
                )}
                {headshotPreview && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Headshot
                    </p>
                    <AppImage
                      src={headshotPreview}
                      alt="Profile headshot"
                      className="h-32 w-32 rounded object-cover border"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
