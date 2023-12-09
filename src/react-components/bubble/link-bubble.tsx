import { LinkIcon } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect, useMemo, useState } from 'react';
import { Popover, PopoverProps, Button, Form, Input, Space } from 'antd';

import { LinkBubbleState, linkBubble } from '../../plugin-link-bubble';
import { useEditorState, usePMRenderer } from '../../react-hooks';

const defaultPopoverAlign: PopoverProps['align'] = { offset: [0, -10] };

export function useLinkBubble() {
  const [open, setOpen] = useState(false);
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);
  const [changeState, setChangeState] = useState<LinkBubbleState>(null);

  const element = portalEl
    ? createPortal(
        <LinkBubble
          key={changeState && changeState.range.from + '-' + changeState.range.to}
          changeState={changeState}
          open={open}
        />,
        portalEl
      )
    : null;

  const plugin = useMemo(() => {
    return linkBubble({
      onAttach(portal) {
        setPortalEl(portal);
      },
      onOpenChange(open, changeState) {
        setOpen(open);

        if (open) {
          setChangeState(changeState!);
        } else {
          setChangeState(null);
        }
      }
    });
  }, []);

  return useMemo(() => {
    return {
      plugin,
      element
    };
  }, [element]);
}

type FieldType = {
  title?: string;
  url: string;
};

type LinkBubbleProps = Omit<PopoverProps, 'content'> & {
  changeState: LinkBubbleState;
};

export function LinkBubble({ changeState, ...popoverProps }: LinkBubbleProps) {
  const pmRenderer = usePMRenderer();

  return (
    <Popover
      destroyTooltipOnHide
      trigger="click"
      arrow={false}
      content={
        <LinkBubbleContent
          onFinish={values => {
            pmRenderer
              .chain()
              .setTextSelection(changeState?.range!)
              .setLink({ href: values.url })
              .run();
          }}
        />
      }
      align={defaultPopoverAlign}
      {...popoverProps}
    >
      <div style={{ height: '100%' }}></div>
    </Popover>
  );
}

function LinkBubbleContent(props: { onFinish: (values: FieldType) => void }) {
  useEditorState(true);
  const pmRenderer = usePMRenderer();
  const [form] = Form.useForm<FieldType>();

  const link = pmRenderer.getAttributes('link');

  useEffect(() => {
    form.setFieldValue('url', link.href);
  }, [link]);

  return (
    <Form<FieldType>
      form={form}
      initialValues={{ url: link.href }}
      autoComplete="off"
      size="small"
      onFinish={props.onFinish}
    >
      <Form.Item<FieldType>
        label="Url"
        name="url"
        rules={[{ required: true, message: 'Please input url!' }]}
      >
        <Input
          suffix={
            <a href={link.href} target="_blank">
              <LinkIcon width={14} height={14} />
            </a>
          }
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Space>
          <Button size="small" type="primary" htmlType="submit">
            Confirm
          </Button>
          <Button
            size="small"
            onClick={() => {
              pmRenderer.chain().focus().unsetLink().run();
            }}
          >
            Remove link
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
