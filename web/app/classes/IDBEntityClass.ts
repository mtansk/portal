export interface IDBEntityClass<T> {
	createSQLObject(): object;
	copy(): T;
}
