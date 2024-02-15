import { IsInt, IsNotEmpty, IsNumber, IsString, IsUrl, Length } from "class-validator";
import { Offer } from "src/offers/entities/offer.entity";
import { User } from "src/users/entities/user.entity";
import { Wishlist } from "src/wishlists/entities/wishlist.entity";
import {
  Column, 
  CreateDateColumn, 
  Entity, 
  ManyToMany, 
  ManyToOne, 
  OneToMany, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";

@Entity()
export class Wish {

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Length(1, 250)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsUrl()
  @IsNotEmpty()
  link: string;
  
  @Column()
  @IsUrl()
  @IsNotEmpty()
  image: string;

  @Column()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @Column({default: 0})
  @IsNumber()
  raised: number;

  @Column()
  @IsNotEmpty()
  @Length(1, 1024, {message: 'Description must be 1 - 1024 symbols long!'})
  @IsString()
  description: string;

  @Column({default: 0})
  @IsInt()
  copied: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @ManyToMany(() => Wishlist, (list) => list.items)
  wishlists: Wishlist[]
};
