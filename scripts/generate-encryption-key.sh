#!/bin/bash

node -e "console.log('Generated 32-byte hex key:', require('crypto').randomBytes(32).toString('hex'))"
