import { Length, IsEmail, IsUrl, IsString, IsNotEmpty } from "class-validator"; 
import { Wish } from "src/wishes/entities/wish.entity";
import { Offer } from "src/offers/entities/offer.entity";
import { Wishlist } from "src/wishlists/entities/wishlist.entity";
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  OneToMany 
} from "typeorm";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    unique: true,
  })
  @Length(2, 30)
  @IsString()
  @IsNotEmpty()
  username: string;

  @Column({
    default: 'Пока ничего не рассказал о себе'
  })
  @Length(2, 200)
  @IsString()
  about: string;

  @Column({
    default: 'https://i.pravatar.cc/300'
  })
  @IsUrl()
  avatar: string;

  @Column({
    unique: true
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];
  
  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
};
