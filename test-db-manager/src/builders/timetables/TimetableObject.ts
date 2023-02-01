import { v4 as uuid } from 'uuid';

export abstract class TimetableObject<
  // TODO: Type better (recursive)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ChildObjectType extends TimetableObject<any, any>,
  PropertiesType extends object,
> {
  abstract UUIDFieldName: string;

  abstract parentUUIDFieldName: string | undefined;

  uuid: UUID;

  parentUuid: UUID | undefined;

  properties: PropertiesType;

  children: ChildObjectType[] = [];

  constructor(properties: PropertiesType) {
    this.properties = properties;
    // eslint-disable-next-line no-constructor-return
    return this;
  }

  addChild(child: ChildObjectType) {
    this.children.push(child);

    return this;
  }

  addChildren(childs: ChildObjectType[]) {
    this.children = [...this.children, ...childs];

    return this;
  }

  setIds(parentUuid?: UUID) {
    this.uuid = uuid();
    this.parentUuid = parentUuid;

    this.children.forEach((child) => {
      child.setIds(this.uuid);
    });
  }

  build() {
    this.setIds();

    return this;
  }

  generateObject(): PropertiesType {
    if (this.parentUUIDFieldName && !this.parentUuid) {
      // eslint-disable-next-line no-console
      console.error(
        'No parent id set! Make sure you have built the seed object!',
      );
    }

    return {
      [this.UUIDFieldName]: this.uuid,
      [this.parentUUIDFieldName]: this.parentUuid,
      ...this.properties,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cloneChildren(sourceObject: TimetableObject<any, any>) {
    this.addChildren(sourceObject.children?.map((child) => child.clone()));

    return this;
  }

  abstract clone();
}
