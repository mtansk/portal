type IdDateMap = Map<string, Set<string>>;

export class IdDateMapper {
    map: IdDateMap;

    static default = "default";

    public constructor(id?: string, date?: string) {
        this.map = new Map<string, Set<string>>([
            [IdDateMapper.default, new Set<string>()],
        ]);
        if (id) {
            this.setId(id);
            if (date) {
                this.switchDateInMap(date, id);
            }
        }
    }

    public setId(id: string) {
        if (!this.map.has(id)) {
            this.map.set(id, new Set<string>([]));
        }
    }

    public switchDateInMap(date: string, id?: string) {
        if (id) {
            if (this.map.has(id)) {
                if (this.map.get(id)?.has(date)) {
                    this.map.get(id)?.delete(date);
                } else {
                    this.map.get(id)?.add(date);
                }
            } else {
                this.map.set(id, new Set<string>([date]));
            }
        } else {
            if (this.map.get(IdDateMapper.default)?.has(date)) {
                this.map.get(IdDateMapper.default)?.delete(date);
            } else {
                this.map.get(IdDateMapper.default)?.add(date);
            }
        }
    }

    public createSQLObject() {
        const obj: Record<string, string[]> = {};

        if (this.map.get(IdDateMapper.default)?.size === 0) {
            this.map.forEach((value, key) => {
                if (key === IdDateMapper.default) return;
                obj[key] = Array.from(value);
            });
        } else {
            this.map.forEach((_, key) => {
                if (key === IdDateMapper.default) return;
                obj[key] = Array.from(
                    this.map.get(IdDateMapper.default)?.values() || [],
                );
            });
        }

        return obj;
    }

    public copy() {
        const map = new IdDateMapper();
        this.map.forEach((value, key) => {
            map.map.set(key, new Set<string>(value));
        });
        return map;
    }

    public getUsers({}) {
        return Array.from(this.map.keys());
    }
}
