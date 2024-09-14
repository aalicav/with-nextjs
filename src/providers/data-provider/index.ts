"use client"

import dataProviderSimpleRest from "@refinedev/simple-rest";

import { axiosInstance } from "@/utils/axiosInstance";

const API_URL = process.env.API_URL ?? '';

export const dataProvider = dataProviderSimpleRest(API_URL, axiosInstance);
