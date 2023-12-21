'use client';

import { useMemo } from 'react';
import { Badge, Divider, Input, Modal, ModalProps, Segmented } from 'antd';
import Image from 'next/image';
import { useImmer } from 'use-immer';
import LogoHeroPng from '@/public/logo-hero.png';
import ProMonthlyQrCodeWeixin from '@/public/pro-monthly-qrcode-weixin.jpg';
import ProMonthlyQrCodeAlipay from '@/public/pro-monthly-qrcode-alipay.jpg';
import capitalize from 'lodash/capitalize';
import { PLANS, ProPlan, sleep } from '@/common';

import { Icon } from './icon';

interface UpgradeToProState {
  plan: 'Pro' | 'Free';
  period: 'monthly' | 'yearly';
  payLoading: boolean;
  paySegmentedValue: 'Weixin' | 'Alipay' | 'CDkey';
}

const PaySegmented = ['Weixin', 'Alipay', 'CDkey'];

export function UpgradeToPro(props: ModalProps) {
  const [state, dispatch] = useImmer<UpgradeToProState>({
    plan: 'Pro',
    paySegmentedValue: 'Weixin',
    payLoading: false,
    period: 'monthly'
  });

  const features = useMemo(() => {
    const p = PLANS.find(item => item.name === state.plan);

    return p?.features || [];
  }, [state.plan]);

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
            <h2 className="text-xl">Upgrade to Pro</h2>
            <div className="text-sm text-gray-500">
              Enjoy higher limits and extra features with our Pro plan.
            </div>
          </div>
          <Divider type="horizontal" />
        </div>
      }
      closable={false}
      footer={state.plan === 'Free' ? null : undefined}
      {...props}
      okText="Check Pay Status"
      okButtonProps={{
        loading: state.payLoading,
        ...props.okButtonProps
      }}
      onOk={async e => {
        dispatch(draft => {
          draft.payLoading = true;
        });

        await sleep(1000);

        dispatch(draft => {
          draft.payLoading = false;
        });
        // props.onOk?.(e);
      }}
    >
      <div className="px-4 my-10">
        <div className="mb-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-gray-900">
                {state.plan} {capitalize(state.period)}
              </h4>
              <Badge className="text-sm font-normal normal-case">
                {state.plan === 'Free' && 'Free'}$
                {state.plan === 'Pro' && ProPlan.price[state.period].amount}/
                {state.period.replace('ly', '')}
              </Badge>
            </div>
            <button
              onClick={() => {
                // setPlan(plan === 'Free' ? 'Pro' : 'Free');
                dispatch(draft => {
                  draft.plan = draft.plan === 'Free' ? 'Pro' : 'Free';
                });
              }}
              className="text-xs text-gray-500 underline underline-offset-4 transition-colors hover:text-gray-800"
            >
              {/* {period === 'monthly' ? 'Get 2 months free 🎁' : 'Switch to monthly'} */}
              {state.plan === 'Free' ? 'Switch to Pro' : 'Switch to Free'}
            </button>
          </div>

          <div className="flex flex-col space-y-2">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center space-x-2 text-sm text-gray-500">
                <Icon name="check-circle-2" className="text-green-500" size={16} />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
        {/* qrcode */}
        {state.plan === 'Pro' && (
          <div className="mb-4">
            <Divider type="horizontal" />

            <div className="flex flex-col items-center">
              <Segmented
                options={PaySegmented}
                value={state.paySegmentedValue}
                onChange={value => {
                  dispatch(draft => {
                    draft.paySegmentedValue = value as UpgradeToProState['paySegmentedValue'];
                  });
                }}
              />

              {state.paySegmentedValue === 'Weixin' && (
                <div className="mt-2">
                  <Image
                    className="w-[200px] h-[300px]"
                    src={ProMonthlyQrCodeWeixin}
                    alt="pro-monthly-qrcode"
                    width={200}
                    height={300}
                  />
                </div>
              )}

              {state.paySegmentedValue === 'Alipay' && (
                <div className="mt-2">
                  <Image
                    className="w-[200px] h-[300px]"
                    src={ProMonthlyQrCodeAlipay}
                    alt="pro-monthly-qrcode"
                    width={200}
                    height={300}
                  />
                </div>
              )}

              {state.paySegmentedValue === 'CDkey' && (
                <div className="mt-2">
                  <Input width="300px" placeholder="Please enter cdkey" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
