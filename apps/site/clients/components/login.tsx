'use client';

import { Button, Divider, Input, Modal, ModalProps } from 'antd';
import Image from 'next/image';
import LogoHeroPng from '@/public/logo-hero.png';

export function LoginModal(props: ModalProps) {
  return (
    <Modal
      title={
        <div className="text-center">
          <div>
            <div className="flex justify-center my-4">
              <Image
                src={LogoHeroPng}
                alt="logo-hero"
                className="h-[160px] w-[160px] rounded-full"
              />
            </div>
            <h2 className="text-xl">Sign in to Marktion.io</h2>
            <div className="text-sm text-gray-500">
              Markdown base service that is ready to use right away.
            </div>
          </div>
          <Divider type="horizontal" />
        </div>
      }
      footer={null}
      closable={false}
      {...props}
    >
      <div className="px-4 my-10">
        <Button href="/login/github" type="primary" block size="large">
          Continue with GitHub
        </Button>

        <Divider type="horizontal" />

        <Input placeholder="your@email.com" />

        <Button className="mt-2" href="/login/github" block size="large">
          Continue with Email
        </Button>
      </div>
    </Modal>
  );
}
