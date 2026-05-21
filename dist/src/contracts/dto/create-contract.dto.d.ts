declare class ClientInfoDto {
    fullName: string;
    rfc: string;
    phone: string;
    email: string;
    address: string;
    investmentPurpose: string;
}
export declare class CreateContractDto {
    productId: string;
    debitAccountId: string;
    creditAccountId: string;
    amount: number;
    clientInfo: ClientInfoDto;
    signatureToken: string;
}
export {};
