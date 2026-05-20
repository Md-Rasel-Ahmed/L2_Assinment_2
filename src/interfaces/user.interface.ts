type Trole="contributor"|"maintainer"

export interface Iuser{
   name:string,
   email:string,
   password:string,
   role?:Trole
   created_at:string,
   updated_at:string

}
