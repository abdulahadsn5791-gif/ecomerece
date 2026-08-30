import { BaseService } from '../../../services/base.service';
import type { AuthAdapter, AuthUser } from '../../../services/auth';
import type { UserResponseReadModel } from '@ecomerece/shared';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export class AuthService extends BaseService<UserResponseReadModel> {
  private readonly adapter: AuthAdapter;

  constructor(adapter: AuthAdapter) {
    super(null, null, 'auth-service');
    this.adapter = adapter;
  }

  public async signInWithGoogle(): Promise<void> {
    this.setSubmitting(true);
    await this.adapter.ensureReady();
    await this.adapter.signInWithGoogle();
    this.setSubmitting(false);

  }

  public async submitLogin(): Promise<void> {
    this.setSubmitting(true);
    await this.adapter.ensureReady();
    const token = await this.computeToken();
    await this.post(`${apiUrl}/users/me`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    this.setSubmitting(false);

  }

  public async submitSignUp(): Promise<void> {
    this.setSubmitting(true);
    await this.adapter.ensureReady();
    const token = await this.computeToken();
    const user = await this.computeClerkUser();
    await this.post(`${apiUrl}/${user.id}/signup`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    this.setSubmitting(false);

  }

  public async signOut(): Promise<void> {
    this.setSubmitting(true);
    await this.adapter.ensureReady();
    await this.adapter.signOut();
    await this.resetAndClearStorage();
    this.setSubmitting(false);

  }


  private async computeClerkUser(): Promise<{ id: string; email: string; name: string }> {
    await this.adapter.ensureReady();
    const user = this.adapter.getClerkUser();
    if (!user) throw new Error('User not signed in');
    return user;
  }

  private async computeToken(): Promise<string> {
    await this.adapter.ensureReady();
    const token = await this.adapter.getToken();
    if (!token) throw new Error('No authentication token available');
    return token
  }

  private async fetchUserFromBackend(): Promise<UserResponseReadModel> {
    await this.adapter.ensureReady();
    const token = await this.computeToken();
    const user = await this.get(`${apiUrl}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return user;
  }


  public async syncUser(): Promise<UserResponseReadModel | null> {
    this.setLoading(true);
    await this.adapter.ensureReady();
    const isSignedIn = this.adapter.isSignedIn();

    if (!isSignedIn) {
      this.resetState();
      return null;
    }

    const expired = await this.adapter.isExpired();
    if (expired) {
      this.setError('Session expired');
      this.resetState();
      return null;
    }

    const cached = this.getStore().getState().data;
    if (cached) {
      this.setData(cached);
      this.setLoading(false);
      return cached
    }

    const user = await this.fetchUserFromBackend();
    this.setData(user);
    this.setLoading(false);
    return user;

  }

  public isSignedIn(): boolean {
    return this.adapter.isSignedIn();
  }
}