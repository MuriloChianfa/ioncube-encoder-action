![Banner](banner.png)

[![GitHub Super-Linter](https://github.com/MuriloChianfa/ioncube-encoder-action/actions/workflows/linter.yml/badge.svg)](https://github.com/MuriloChianfa/ioncube-encoder-action/actions/workflows/linter.yml)
[![CI](https://github.com/MuriloChianfa/ioncube-encoder-action/actions/workflows/ci.yml/badge.svg)](https://github.com/MuriloChianfa/ioncube-encoder-action/actions/workflows/ci.yml)

Automate and streamline IonCube encoding for your PHP project under Laravel, Joomla, Wordpress frameworks with this powerful GitHub Action. Encode your source code effortlessly, ensuring an extra layer of security for your proprietary codebase.

## Features

- **Seamless Integration:** Easily integrate IonCube encoding into your CI/CD workflows with a straightforward setup using this GitHub Action.

- **Version Control:** Specify the IonCube version to use for encoding, ensuring compatibility with your project requirements.

- **Flexible Configuration:** Customize the source and output directories, making it adaptable to various project structures.

- **Efficient Workflow:** Save time and resources by automating the encoding process, allowing you to focus on building and deploying your applications.

## Getting Started

- **Setup Secrets**: Create a secret named IONCUBE_PASSPHRASE containing the passphrase to encode files.
- **Configure Workflow**: Copy the example workflow into your project's .github/workflows directory, adjusting parameters as needed.
- **Run Workflow**: Push your changes to trigger the IonCube encoding workflow and enjoy the automated process.

### Usage

```yaml
name: Encode with IonCube

on: [push]

jobs:
  encode:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout Repository
      uses: actions/checkout@v2

    - name: IonCube Encode
      uses: murilochianfa/ioncube-encode-action@v1.0.0
      with:
        source: 'src'
        output: 'encrypted'
```

### Inputs

- ***template***: The template to choose the best parameters for type of projects.
- ***trial***: Encode file with trial version of ioncube.
- ***source***: The file or directory containing your PHP project.
- ***output***: The file or directory where the encoded project will be saved.
- ***encoder-version***: The Ioncube encoder version.
- ***php-target-version***: The PHP encoded files target version.
- ***arch***: Architecture of target environment runner.

<hr>

> [!IMPORTANT]
>
> Make sure to ignore the commits for encrypted files.
> After encrypt your project, test them for make sure your correct functionality.

## Example

Explore a complete example of a workflow that utilizes this action in the <a href="https://github.com/MuriloChianfa/ioncube-encoder-action">example project</a>.

## Testing this package

```bash
npm run lint
npm run test
npm run package
```

### Dependencies

- *NodeJS 20.8.0 or higher.*
- *NPM 10.1.0 or higher.*

## Commitment to Quality
During package development, try as best as possible to embrace good design and
development practices to try to ensure that this package is as good as it can
be. The checklist for package development includes:

-   ✅ Have no Lint warnings throughout all code.
-   ✅ Include comprehensive documentation in README.md.

## Contributions

We welcome contributions! Feel free to open issues for suggestions or bug reports, and pull requests are highly appreciated.

## Security

If you discover any security related issues, please email murilo.chianfa@outlook.com instead of using the issue tracker.

## Credits

- [Murilo Chianfa](https://github.com/MuriloChianfa)
- [All Contributors](../../contributors)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## Acknowledgments

Special thanks to <a href="https://www.ioncube.com/">IonCube</a> for providing robust encoding technology.
