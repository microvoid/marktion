import { AuthHelper, postService } from '@/libs';
import { ModelContextProvider } from '@/clients/context/model-context';

import { Home } from './page-home';

export default async function () {
  const user = await AuthHelper.getSessionUser();

  return (
    <ModelContextProvider
      defaultValue={{
        user
      }}
    >
      <Home />
    </ModelContextProvider>
  );
}
