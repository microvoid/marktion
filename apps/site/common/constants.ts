export const GUEST_SESSION_ID = 'marktion-session-id';

export const SESSION_KEY = process.env.SESSION_KEY || 'marktion';

export const PLANS_AI_LIMIT = {
  Pro: 300,
  Free: 20
};

export const PLANS_PROJECT_SPACE_SIZI = {
  Pro: 20 * 1024 * 1024,
  Free: 1 * 1024 * 1024
};

export const PLANS = [
  {
    name: 'Pro',
    slug: 'pro',
    price: {
      monthly: {
        amount: 15,
        priceIds: {
          test: '',
          production: ''
        }
      },
      yearly: {
        amount: 99,
        priceIds: {
          test: '',
          production: ''
        }
      }
    },
    features: [
      'Unlimited Posts',
      `${gbFormat(PLANS_PROJECT_SPACE_SIZI.Pro)} GB Storage`,
      `AI Request ${PLANS_AI_LIMIT.Pro} / day`,
      'Gpt4 Support(Comming soon)',
      'Unlimited Projects Users'
    ]
  },
  {
    name: 'Free',
    slug: 'free',
    price: {
      monthly: {
        amount: 0,
        priceIds: {
          test: '',
          production: ''
        }
      },
      yearly: {
        amount: 0,
        priceIds: {
          test: '',
          production: ''
        }
      }
    },
    features: [
      'Unlimited Posts',
      `${gbFormat(PLANS_PROJECT_SPACE_SIZI.Free)} GB Storage`,
      `AI Request ${PLANS_AI_LIMIT.Pro} / day`,
      'Gpt4 Support(Comming soon)',
      'Project Users 10'
    ]
  }
];

export const ProPlan = PLANS[0];
export const FreePlan = PLANS[1];

function gbFormat(n: number) {
  return Math.floor(n / 1024 / 1024);
}
