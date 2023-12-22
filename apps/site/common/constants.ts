export const GUEST_SESSION_ID = 'marktion-auth.guest';

export const SESSION_KEY = process.env.SESSION_KEY || 'marktion';

export const PLANS_AI_LIMIT = {
  Pro: 300,
  Free: 20
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
      '20 GB Storage',
      `AI Request ${PLANS_AI_LIMIT.Pro} / day`,
      'Gpt4 Support(Comming soon)',
      'Unlimited Projects Users(Comming soon)'
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
      '1 GB Storage',
      'Unlimited Posts',
      'Project Users 10(Comming soon)',
      `AI Request ${PLANS_AI_LIMIT.Pro} / day`
    ]
  }
];

export const ProPlan = PLANS[0];
export const FreePlan = PLANS[1];
