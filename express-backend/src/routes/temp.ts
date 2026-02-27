import express, { Router } from 'express';

const router =  Router();

router.get('/hellow', (req, res) => {
    res.json({ message: 'This is a temporary route' });
});

export default router;