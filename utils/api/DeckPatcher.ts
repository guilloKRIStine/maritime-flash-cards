export default class DeckPatcher {
    private _name: string | null;
    private _description: string | null;
    
    constructor() {
        this._name = null;
        this._description = null;
    }
    
    public patchName(newName: string): DeckPatcher {
        this._name = newName;
        return this;
    }
    
    public patchDescription(newDescription: string): DeckPatcher {
        this._description = newDescription;
        return this;
    }
    
    public build(): object[] {
        let result = new Array<object>();
        
        if (this._name) {
            result.push({
                op: "replace",
                path: "/name",
                value: this._name
            });
        }
        
        if (this._description !== null) {
            result.push({
                op: "replace",
                path: "/description",
                value: this._description
            });
        }
        
        return result;
    }
}