import { ApparelUpdateType, Order } from "../ApparelTypes";
import { checkIfOrderCanBeFullfilled, fetchApparel, findCost, updateMultipleApparelDetails, updateQualityAndPriceToApparelList } from "../service/apparel.service";
import { HttpError } from "../utility/httpError";
import { Request, Response } from 'express';


const getApparel = async (req: Request, res: Response) => {
    try {
        const data = await fetchApparel();
        res.json(data);
    }
    catch (err) {
        console.error("Error while retrieving apparel list:", err);
        res.status(500).json({ msg: "Error while retrieving apparel list" });
    }
}



//Update quality & size of apparel based on code and size.
const updateQualityAndSize = async (req: Request, res: Response) => {
    try {
        const code = parseInt(req.params.code);
        const size = req.params.size;
        const quality = req.body.quality;
        const price = req.body.price;

        if (!quality || !price) {
            res.status(400).send("Please enter the price and quality fields")
        }
        // Find the apparel item with the specified code
        const apparelList = await fetchApparel();
        await updateQualityAndPriceToApparelList(apparelList, code, size, quality, price)
        res.json({ msg: "Apparel list  updated successfully" });
    }
    catch (error) {
        console.error("Something went wrong", error);
        if (error instanceof HttpError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}


//Update multiple quality & price of several apparels.
const updateMultipleQualityAndSize = async (req: Request, res: Response) => {
    try {
        const apparelUpdates: ApparelUpdateType[] = req.body;
        const apparelList = await fetchApparel();

        await updateMultipleApparelDetails(apparelUpdates, apparelList);

        // Return a success response
        return res.status(200).json({ msg: "Apparel updates applied successfully" });
    } catch (error) {
        console.error("Something went wrong", error);
        if (error instanceof HttpError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

const checkOrder = async (req: Request, res: Response) => {
    try {
        const order = req.body.order as Order[];
        console.log("req.body", req.body);
        const apparelList = await fetchApparel();

        await checkIfOrderCanBeFullfilled(order, apparelList)

        // If all requested items can be fulfilled, return a success message
        return res.json({ msg: "Order can be fulfilled" });

    } catch (error) {
        console.error("Something went wrong", error);
        if (error instanceof HttpError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

};

const cost = async (req: Request, res: Response) => {

    try {
        const { order } = req.body;

        // Get the list of all apparel items
        const apparelList = await fetchApparel()
        const totalCost = await findCost(order, apparelList)

        res.json({ lowestCost: totalCost });
    }
    catch (error) {
        console.error("Something went wrong", error);
        if (error instanceof HttpError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export { getApparel, updateQualityAndSize, updateMultipleQualityAndSize, checkOrder, cost }