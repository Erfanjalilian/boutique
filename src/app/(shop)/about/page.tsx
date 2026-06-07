import { getAbout } from "@/lib/repositories";
import { Card } from "@/components/ui/Card";

export default async function AboutPage() {
  const about = await getAbout();

  const sections = [
    { title: "داستان ما", content: about.story },
    { title: "مأموریت ما", content: about.mission },
    { title: "چشم‌انداز ما", content: about.vision },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <h1 className="text-4xl font-bold mb-4">درباره ما</h1>
      <p className="text-lg text-muted leading-relaxed mb-12">
        {about.description}
      </p>

      <div className="space-y-6">
        {sections.map((section) => (
          <Card key={section.title} className="p-6">
            <h2 className="text-xl font-semibold mb-3 text-primary">
              {section.title}
            </h2>
            <p className="text-muted leading-relaxed">{section.content}</p>
          </Card>
        ))}

        {about.additionalContent && (
          <Card className="p-6">
            <p className="text-muted leading-relaxed">
              {about.additionalContent}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
