interface ApparelSizeType {
    size: string;
    quantity: number;
    price: number;
    quality: string;
}
interface ApparelListType {
    code: number;
    type: string;
    sizes: ApparelSizeType[];
}
interface ApparelSizeUpdateType {
    size: string;
    price: number;
    quality: string;
    quantity: number;
}

interface ApparelUpdateType {
    code: number;
    sizes: ApparelSizeUpdateType[];
}

interface Order {
    code: number;
    size: string;
    quantity: number;
}
export { ApparelListType, ApparelUpdateType, Order }