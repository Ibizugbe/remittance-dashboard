export type Currency = 'USD' | 'GBP' | 'CAD';
export type RecipientCurrency = 'NGN' | 'ZAR';


export interface AuthTokens { access_token: string; refresh_token?: string }
export interface UserProfile { id: number; email: string; name?: string }


export interface RateTable { [k: string]: number }


export interface Recipient {
id: string;
name: string;
email?: string;
phone?: string;
countryCode: 'ng' | 'za' | 'gb';
avatar?: string;
}


export type TxStatus = 'pending' | 'success' | 'failed';


export interface TransactionItem {
id: string;
createdAt: string;
fromAmount: number;
fromCurrency: Currency;
toAmount: number;
toCurrency: RecipientCurrency;
rate: number;
recipient: Recipient;
status: TxStatus;
}