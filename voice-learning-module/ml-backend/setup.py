"""
ML Backend Setup and Configuration
"""

from setuptools import setup, find_packages

setup(
    name='voice-learning-ml',
    version='1.0.0',
    description='Machine Learning Backend for Voice Learning Module',
    author='Voice Learning Research Team',
    packages=find_packages(),
    install_requires=[
        'numpy>=1.21.0',
        'scipy>=1.7.0',
        'scikit-learn>=1.0.0',
        'pandas>=1.3.0',
        'librosa>=0.9.0',
        'soundfile>=0.10.0',
        'flask>=2.0.0',
        'flask-cors>=3.0.0',
        'python-dotenv>=0.19.0',
    ],
    python_requires='>=3.8',
    entry_points={
        'console_scripts': [
            'voice-ml-server=app:create_app',
        ],
    },
    classifiers=[
        'Development Status :: 4 - Beta',
        'Intended Audience :: Education',
        'Topic :: Education',
        'Topic :: Scientific/Engineering :: Artificial Intelligence',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: 3.9',
        'Programming Language :: Python :: 3.10',
    ],
)
