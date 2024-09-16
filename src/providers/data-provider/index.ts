"use client"
import dotenv from 'dotenv';

dotenv.config();

import dataProviderSimpleRest from "@refinedev/simple-rest";

import { axiosInstance } from "@/utils/axiosInstance";


export const dataProvider = dataProviderSimpleRest('/api', axiosInstance);
