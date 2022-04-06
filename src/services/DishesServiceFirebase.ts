import firebase, {app} from "../config/firebase-config";
import {collectionData} from "rxfire/firestore";
import {Observable} from "rxjs";
import DishService from "./DishService";
import Dish from "../models/Dish";


export default class DishesServiceFirebase implements DishService {
    db: firebase.firestore.CollectionReference;
    constructor(collectionName: string) {
        this.db = firebase.firestore().collection(collectionName);
    }
    async exists(id: number): Promise<boolean> {
        const doc = await this.db.doc(id.toString()).get();
        return doc.exists;//returns Promise with true if the document exists
    }
    async addImage(image: any): Promise<any> {
        const storageRef = app.storage().ref();
        const fileRef = storageRef.child(image.name);
        await fileRef.put(image);
        const fileUrl = await fileRef.getDownloadURL();
        return fileUrl;
    }
    async addDish(dish:Dish): Promise<any> {
        console.log("dishID: " + dish.id)
        const res:boolean = await this.exists(dish.id);
        if (res) {
            throw `dish with id ${dish.id} already exists`
        }
        return this.setDish(dish);

    }

    private setDish(dish: Dish) {
        return this.db.doc(dish.id.toString()).set(dish);
    }

    getAllDishes(): Observable<Dish[]> {
        return collectionData<Dish>(this.db);
    }

    async removeDish(id: number): Promise<any> {
        if(!await this.exists(id)) {
            throw `dish with id ${id} doesn't exists`;
        }
        return this.db.doc(id.toString()).delete();
    }

    async updateDish(id: number, dish: Dish): Promise<any> {
        if(!await this.exists(id)) {
            throw `customer with id ${id} doesn't exists`;
        }
        return this.setDish(dish);
    }

}
