class AuthService {
  private baseUrl = '/api/v1';

  async login(email: string, password: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({ email, password }),
      credentials:'include'
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  }

  async register(email: string, password: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    return response.json();
  }

  async requestPasswordChange(email: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/auth/reset-password`, {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({ email })
    });

    if (!response.ok) {
      throw new Error('Password change request failed');
    }

    return response.json();
  }

  async logout(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/auth/logout`, {
      method:'GET',
      credentials:'include'
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    return response.json();
  }

  async changePassword(token: string, newPassword: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/auth/change-password/${token}`, {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({ password:newPassword })
    });

    if (!response.ok) {
      throw new Error('Password change failed');
    }

    return response.json();
  }

  async activateAccount(token: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/auth/activate/${token}`, {
      method:'GET'
    });

    if (!response.ok) {
      throw new Error('Account activation failed');
    }

    return response.json();
  }
}

export default new AuthService();
