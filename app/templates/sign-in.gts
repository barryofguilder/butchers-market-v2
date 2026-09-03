import type { RouteTemplate } from '../utils/route-template';
import type SignInController from '../controllers/sign-in';
import Container from '../components/container';
import SignInForm from '../components/sign-in-form';

const SignInTemplate: RouteTemplate<never, SignInController> = <template>
  <div class='mt-32'>
    <Container>
      <SignInForm @onAuthenticated={{@controller.authenticated}} />
    </Container>
  </div>
</template>;

export default SignInTemplate;
