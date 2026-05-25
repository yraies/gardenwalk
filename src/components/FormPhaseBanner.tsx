import DocumentPhaseBadge from "./DocumentPhaseBadge";

type FormPhaseBannerProps = {
  phase: "draft" | "published" | "shared";
};

export default function FormPhaseBanner({ phase }: FormPhaseBannerProps) {
  const config = {
    draft: {
      label: "Filling Out",
      tone: "draft" as const,
      description:
        "Answers are editable here, but the structure comes from a finalized template and stays fixed while you fill it out.",
    },
    published: {
      label: "Reading Results",
      tone: "published" as const,
      description:
        "This published response is locked. To revise it, create a new local draft copy instead of editing the published result in place.",
    },
    shared: {
      label: "Reading Results",
      tone: "shared" as const,
      description:
        "This shared response is read-only. Create a new local draft if you want to explore your own answers without changing the shared result.",
    },
  } as const;

  const current = config[phase];
  return <DocumentPhaseBadge {...current} />;
}
