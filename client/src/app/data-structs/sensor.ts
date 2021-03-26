import { Item } from './item';

/**
 * Sensor class, is also an Item.
 */
export class Sensor implements Item {
    private Pic: String; // Base64 Encoded
    private Name: String;
    private Body: String;

    /**
     * Constructor.
     * 
     * @param pic - Sensor pic.
     * @param name - Sensor name.
     * @param body - Text body, "regular sensor" by default.
     */
    constructor(pic: String, name: String, body: String="regular sensor") {
        if (pic === null) {
            this.Pic = "";
        } else {
            this.Pic = pic;
        }
        this.Name = name;
        this.Body = body;
    }

    /**
     * `this.Pic` getter.
     */
    public getPic(): String {
        return this.Pic;
    }

    /**
     * `this.Name` getter.
     * 
     * @returns Name String.
     */
    public getName(): String {
        return this.Name;
    }

    /**
     * @implements Item
     * @returns Name String.
     */
    public getTitle(): String {
        return this.getName();
    }

    /**
     * @implements Item
     * @returns Body String.
     */
    public getBody(): String {
        return this.Body;
    }
 
    /**
     * @implements Item
     * @returns 
     */
    public getID(): String {
        return this.getName();
    }
}