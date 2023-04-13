import { JsonDB, Config } from 'node-json-db';
import { ApparelListType, ApparelUpdateType, Order } from '../ApparelTypes';
import { HttpError } from '../utility/httpError'
const DB_NAME = process.env.DB_NAME

const db = new JsonDB(new Config(`${DB_NAME}`, true, false, '/'));
const fetchApparel = async () => {
    try {
        const data = await db.getData(`/${DB_NAME}`) as ApparelListType[];
        return data;

    }
    catch (err) {
        console.log("Something went wrong", err);
        throw err;
    }

}


const updateQualityAndPriceToApparelList = (apparelList: ApparelListType[], code: number, size: string, quality: string, price: number) => {
    const apparelIndex = apparelList.findIndex(apparel => apparel.code === code);
    if (apparelIndex < 0) {
        throw new HttpError(404, "Apparel item not found");

    }

    // Find the size object with the specified size
    const sizes = apparelList[apparelIndex].sizes;
    const sizeIndex = sizes.findIndex(s => s.size === size);
    if (sizeIndex < 0) {
        throw new HttpError(404, "Size not found");
    }

    // Update the quality and price
    sizes[sizeIndex].quality = quality || sizes[sizeIndex].quality;
    sizes[sizeIndex].price = price || sizes[sizeIndex].price;

    // Save the changes to the database
    db.save();
}

const updateMultipleApparelDetails = (apparelUpdates: ApparelUpdateType[], apparelList: ApparelListType[]) => {
    // Loop through each update and apply changes to the corresponding apparel
    for (const update of apparelUpdates) {
        const { code, sizes } = update;
        const apparelIndex = apparelList.findIndex(apparel => apparel.code === code);

        // If the apparel code is not found, return an error response
        if (apparelIndex === -1) {
            throw new HttpError(404, `Apparel with code ${code} not found`);
        }

        const apparel = apparelList[apparelIndex];

        // Update each size for the current apparel
        for (const sizeUpdate of sizes) {
            const { size, price, quality } = sizeUpdate;
            const sizeIndex = apparel.sizes.findIndex(size => size.size === sizeUpdate.size);

            // If the size is not found for the current apparel, return an error response
            if (sizeIndex === -1) {
                throw new HttpError(404, `Size ${size} not found for apparel with code ${code}`);
            }

            // Apply the updates to the size
            apparel.sizes[sizeIndex].price = price;
            apparel.sizes[sizeIndex].quality = quality;
        }

        // Update the corresponding apparel in the database
        db.push(`/apparel[${apparelIndex}]`, apparel, true);
    }
}


const checkIfOrderCanBeFullfilled = (order: Order[], apparelList: ApparelListType[]) => {
    // Iterate over each requested item in the order
    for (const item of order) {
        const apparel = apparelList.find(a => a.code === item.code);

        // If the requested apparel item is not found, return an error
        if (!apparel) {
            throw new HttpError(404, `Apparel item with code ${item.code} not found`);
        }

        // Find the size object with the specified size
        const size = apparel.sizes.find(s => s.size === item.size);

        // If the requested size is not found, return an error
        if (!size) {
            throw new HttpError(404, `Size ${item.size} not found for apparel item with code ${item.code}`);
        }

        // If the requested quantity is greater than the available quantity, return an error
        if (item.quantity > size.quantity) {
            throw new HttpError(404, `Insufficient quantity for size ${item.size} of apparel item with code ${item.code}`);
        }
    }
}

const findCost = (order: Order[], apparelList: ApparelListType[]) => {
    let totalCost = 0;

    // Iterate over each item in the order and calculate the cost
    for (const item of order) {
        const { code, size, quantity } = item;

        // Find the apparel item with the given code
        const apparelItem = apparelList.find((item) => item.code === code);

        if (!apparelItem) {
            throw new HttpError(404, `Apparel item with code ${code} not found`);
        }

        // Find the size with the given size and calculate the cost
        const sizeItem = apparelItem.sizes.find((sizeItem) => sizeItem.size === size);

        if (!sizeItem) {
            throw new HttpError(404, `Size ${size} not found for apparel item with code ${code}`);
        }

        const itemCost = sizeItem.price * quantity;
        totalCost += itemCost;
        return totalCost
    }
}

export { fetchApparel, updateQualityAndPriceToApparelList, updateMultipleApparelDetails, checkIfOrderCanBeFullfilled, findCost }