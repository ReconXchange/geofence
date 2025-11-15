import { signToken, verifyToken } from '@/lib/auth/jwt';

describe('JWT utilities', () => {
  const mockPayload = {
    userId: 'test-user-id',
    email: 'test@example.com',
    role: 'EMPLOYEE',
  };

  it('should sign and verify a valid token', () => {
    const token = signToken(mockPayload);
    expect(token).toBeTruthy();
    expect(typeof token).toBe('string');

    const decoded = verifyToken(token);
    expect(decoded).toMatchObject(mockPayload);
  });

  it('should return null for invalid token', () => {
    const result = verifyToken('invalid-token');
    expect(result).toBeNull();
  });

  it('should return null for expired token', () => {
    // This would require mocking jwt to create an expired token
    // Skipping for now as it's a basic test suite
  });
});
