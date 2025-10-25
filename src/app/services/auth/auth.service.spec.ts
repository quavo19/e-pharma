import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return null when no token is set', () => {
    expect(service.getToken()).toBeNull();
  });

  it('should set and get token', () => {
    const token = 'test-jwt-token';
    service.setToken(token);
    expect(service.getToken()).toBe(token);
  });

  it('should remove token', () => {
    const token = 'test-jwt-token';
    service.setToken(token);
    expect(service.getToken()).toBe(token);

    service.removeToken();
    expect(service.getToken()).toBeNull();
  });

  it('should return false for isAuthenticated when no token', () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should return true for isAuthenticated when token exists', () => {
    service.setToken('test-token');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should return false for isAuthenticated when token is empty', () => {
    service.setToken('');
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should logout by removing token', () => {
    service.setToken('test-token');
    expect(service.isAuthenticated()).toBe(true);

    service.logout();
    expect(service.isAuthenticated()).toBe(false);
  });

  describe('isTokenExpired', () => {
    it('should return true when no token', () => {
      expect(service.isTokenExpired()).toBe(true);
    });

    it('should return true for invalid token format', () => {
      service.setToken('invalid-token');
      expect(service.isTokenExpired()).toBe(true);
    });

    it('should return false for valid non-expired token', () => {
      // Create a mock JWT token with future expiration
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(
        JSON.stringify({
          exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
        })
      );
      const signature = 'mock-signature';
      const token = `${header}.${payload}.${signature}`;

      service.setToken(token);
      expect(service.isTokenExpired()).toBe(false);
    });

    it('should return true for expired token', () => {
      // Create a mock JWT token with past expiration
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(
        JSON.stringify({
          exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
        })
      );
      const signature = 'mock-signature';
      const token = `${header}.${payload}.${signature}`;

      service.setToken(token);
      expect(service.isTokenExpired()).toBe(true);
    });
  });
});

