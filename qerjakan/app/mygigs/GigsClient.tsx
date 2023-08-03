'use client';

import axios from "axios";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import useAddServiceModal from "../hooks/useAddServiceModal";

const GigClient = () => {
    const serviceModal = useAddServiceModal();
    return (
        <div className="flex justify-end py-2">
            <button onClick={serviceModal.onOpen} className="btn btn-sm">Create New Gigs</button>
        </div>
    )
}
export default GigClient