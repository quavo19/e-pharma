import { TestBed } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../../services/auth/auth.service';

describe('AuthInterceptor', () => {
  let authService: AuthService;
  let mockNext: jest.Mock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService],
    });

    authService = TestBed.inject(AuthService);
    mockNext = jest.fn();
  });

  it('should add Authorization header when token exists', () => {
    // Arrange
    const token = 'test-jwt-token';
    jest.spyOn(authService, 'getToken').mockReturnValue(token);

    const request = new HttpRequest('GET', '/api/test');

    // Act
    authInterceptor(request, mockNext);

    // Assert
    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-jwt-token',
        }),
      })
    );
  });

  it('should not add Authorization header when token is null', () => {
    // Arrange
    jest.spyOn(authService, 'getToken').mockReturnValue(null);

    const request = new HttpRequest('GET', '/api/test');

    // Act
    authInterceptor(request, mockNext);

    // Assert
    expect(mockNext).toHaveBeenCalledWith(request);
  });

  it('should not add Authorization header when token is empty', () => {
    // Arrange
    jest.spyOn(authService, 'getToken').mockReturnValue('');

    const request = new HttpRequest('GET', '/api/test');

    // Act
    authInterceptor(request, mockNext);

    // Assert
    expect(mockNext).toHaveBeenCalledWith(request);
  });
});

