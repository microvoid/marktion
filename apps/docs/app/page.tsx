"use client";

import { Editor } from "@marktion/editor";
import { Card, Container, Section } from "@radix-ui/themes";

export default function () {
  return (
    <Container>
      <Section>
        <Card>
          <Editor />
        </Card>
      </Section>
    </Container>
  );
}
