"use client";

import { Editor } from "@marktion/editor";
import { Card, Container, Section } from "@radix-ui/themes";
import { MARKDOWN } from "./demo-md";

export default function () {
  return (
    <Container>
      <Section>
        <Card>
          <Editor
            markdown={MARKDOWN.trim()}
            contentEditableClassName="prose max-w-full font-sans"
          />
        </Card>
      </Section>
    </Container>
  );
}
