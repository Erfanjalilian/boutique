import { getContact } from "@/lib/repositories";
import { Card } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const contact = await getContact();

  const socialLinks = [
    { key: "instagram", label: "اینستاگرام", url: contact.socialMedia.instagram },
    { key: "twitter", label: "توییتر", url: contact.socialMedia.twitter },
    { key: "facebook", label: "فیسبوک", url: contact.socialMedia.facebook },
    { key: "telegram", label: "تلگرام", url: contact.socialMedia.telegram },
  ].filter((s) => s.url);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <h1 className="text-4xl font-bold mb-4">تماس با ما</h1>
      <p className="text-muted mb-12">
        خوشحال می‌شویم از شما بشنویم. از طریق راه‌های زیر با ما در ارتباط باشید.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="font-semibold mb-4 text-primary">راه‌های ارتباطی</h2>
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-muted">تلفن</p>
              <p className="font-medium">{contact.phone}</p>
            </div>
            <div>
              <p className="text-muted">ایمیل</p>
              <a
                href={`mailto:${contact.email}`}
                className="font-medium hover:text-primary transition-colors"
              >
                {contact.email}
              </a>
            </div>
            <div>
              <p className="text-muted">آدرس</p>
              <p className="font-medium">{contact.address}</p>
            </div>
          </div>
        </Card>

        {socialLinks.length > 0 && (
          <Card className="p-6">
            <h2 className="font-semibold mb-4 text-primary">شبکه‌های اجتماعی</h2>
            <div className="space-y-3">
              {socialLinks.map((social) => (
                <a
                  key={social.key}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                >
                  <span className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                    {social.label[0]}
                  </span>
                  {social.label}
                </a>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
