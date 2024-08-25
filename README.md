<p align="center">
  <img src="icon.png" alt="Project Logo" width="21%">
</p>

# Public Pool for StartOS

[Public Pool](https://github.com/benjamin-wilson/public-pool) is a fully open source solo Bitcoin mining pool.

This repository creates the `s9pk` package that is installed to run Public Pool on [StartOS](https://github.com/Start9Labs/start-os/). Learn more about service packaging in the [Developer Docs](https://start9.com/latest/developer-docs/).

## Dependencies

Install the system dependencies below to build this project by following the instructions in the provided links. You can also find detailed steps to setup your environment in the service packaging [documentation](https://docs.start9.com/latest/developer-docs/packaging#development-environment).

- [docker](https://docs.docker.com/get-docker)
- [docker-buildx](https://docs.docker.com/buildx/working-with-buildx/)
- [yq](https://mikefarah.gitbook.io/yq)
- [deno](https://deno.land/)
- [make](https://www.gnu.org/software/make/)
- [start-sdk](https://github.com/Start9Labs/start-os/tree/sdk)

## Cloning

Clone the Webtop package repository locally.

```
git clone git@github.com:remcoros/public-pool-startos.git
cd public-pool-startos
```

## Building

To build the service as a universal package, run the following command:

```
make
```

Alternatively the package can be built for individual architectures by specifying the architecture as follows:

```
make x86
```

or

```
make arm
```

## Installing (on StartOS)

Before installation, define `host: https://server-name.local` in your `~/.embassy/config.yaml` config file then run the following commands to determine successful install:

> Change server-name.local to your Start9 server address

```
start-cli auth login
#Enter your StartOS password
make install
```

**Tip:** You can also install the public-pool.s9pk by sideloading it under the **StartOS > System > Sideload a Service** section.

## Verify Install

Go to your StartOS Services page, select **Public Pool**, configure and start the service.

**Done!**
