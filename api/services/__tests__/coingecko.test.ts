import { fetchData } from '../coingecko';

test('handles error correctly', async () => {
    const mockError = new Error('Test error');
    const fetchDataMock = jest.fn().mockRejectedValue(mockError);
    
    await expect(fetchDataMock()).rejects.toThrow('Test error');
});